import { check, sleep } from "k6";
import http from "k6/http";

export const options = {
  stages: [
    { duration: "1m", target: 500 },
    { duration: "2m", target: 1000 },
    { duration: "2m", target: 2000 },
    { duration: "3m", target: 3000 },
    { duration: "2m", target: 0 },
  ],
  thresholds: {
    http_req_duration: [{ threshold: "p(95)<3000", abortOnFail: false }],
    http_req_failed: ["rate<0.01"],
  },
};

const BASE_URL = "http://localhost:3333";

// Armazena estado por VU
const state = new Map();

function createUser(id) {
  return {
    email: `user_${id}@test.com`,
    username: `user_${id}`,
    password: "123456",
    name: `User ${id}`,
  };
}

export default function () {
  const vu = __VU;

  if (!state.has(vu)) {
    const user1 = createUser(vu * 2 - 1);
    const user2 = createUser(vu * 2);
    const headers = { "Content-Type": "application/json" };

    // Signup
    const s1 = http.post(`${BASE_URL}/signup`, JSON.stringify(user1), { headers });
    check(s1, { "user1 signup 201": (r) => r.status === 201 });
    user1.id = s1.json("id");

    const s2 = http.post(`${BASE_URL}/signup`, JSON.stringify(user2), { headers });
    check(s2, { "user2 signup 201": (r) => r.status === 201 });

    // Login
    const l1 = http.post(
      `${BASE_URL}/login`,
      JSON.stringify({ email: user1.email, password: user1.password }),
      { headers },
    );
    check(l1, { "user1 login 200": (r) => r.status === 200 });
    user1.token = l1.json("token");

    const l2 = http.post(
      `${BASE_URL}/login`,
      JSON.stringify({ email: user2.email, password: user2.password }),
      { headers },
    );
    check(l2, { "user2 login 200": (r) => r.status === 200 });
    user2.token = l2.json("token");

    state.set(vu, { user1, user2, followed: false });
  }

  const { user1, user2, followed } = state.get(vu);

  // 1. User1 faz post (permite múltiplos)
  const content = `Post by ${user1.username} at ${new Date().toISOString()}`;
  const post = http.post(`${BASE_URL}/posts`, JSON.stringify({ content }), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user1.token}`,
    },
  });
  check(post, { "post 201": (r) => r.status === 201 });

  // 2. User2 segue User1 (apenas 1 vez por VU)
  if (!followed) {
    const follow = http.post(`${BASE_URL}/follow/${user1.id}`, null, {
      headers: {
        Authorization: `Bearer ${user2.token}`,
      },
    });
    check(follow, { "follow 201 or 409": (r) => r.status === 201 || r.status === 409 });
    state.get(vu).followed = follow.status === 201 || follow.status === 409;
  }

  // 3. User2 acessa feed público
  const get = http.get(`${BASE_URL}/posts?limit=20`);
  check(get, { "get posts 200": (r) => r.status === 200 });

  sleep(Math.random() * 0.3);
}
