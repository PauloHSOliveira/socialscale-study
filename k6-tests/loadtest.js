import { check, sleep } from "k6";
import http from "k6/http";

export const options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "1m", target: 50 },
    { duration: "2m", target: 100 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_duration: [{ threshold: "p(95)<2000", abortOnFail: false }],
    http_req_failed: ["rate<0.02"],
  },
};

const BASE_URL = "http://localhost:3000";

// Store state per VU
const state = new Map();

function generateUniqueId() {
  // Create a shorter unique ID using timestamp + random
  const timestamp = Date.now().toString(36); // Base36 is shorter
  const random = Math.random().toString(36).substring(2, 6); // 4 chars
  return `${timestamp}${random}`;
}

function createUser(vuId, userIndex) {
  const uniqueId = generateUniqueId();
  const shortId = `${vuId}${userIndex}${uniqueId}`.substring(0, 8); // Ensure uniqueness but keep short

  return {
    email: `test.user.${shortId}@loadtest.dev`, // Unique email
    username: `user${shortId}`.substring(0, 20), // Max 20 chars username
    password: "password123",
    name: `Test User ${shortId}`,
  };
}

export default function () {
  const vu = __VU;
  const iteration = __ITER;
  const headers = { "Content-Type": "application/json" };

  if (!state.has(vu)) {
    // Create two unique users for testing
    const user1 = createUser(vu, 1);
    const user2 = createUser(vu, 2);

    console.log(
      `VU ${vu}: Creating users - ${user1.username} (${user1.email}) and ${user2.username} (${user2.email})`,
    );

    // Test Health Check
    const health = http.get(`${BASE_URL}/health`);
    check(health, { "health check 200": (r) => r.status === 200 });

    // Signup User 1
    const signup1 = http.post(`${BASE_URL}/signup`, JSON.stringify(user1), { headers });
    check(signup1, {
      "user1 signup success": (r) => r.status === 201,
      "user1 signup has token": (r) => r.json("token") !== undefined,
      "user1 signup has user": (r) => r.json("user") !== undefined,
    });

    if (signup1.status === 201) {
      const responseBody = signup1.json();
      user1.token = responseBody.token;
      user1.id = responseBody.user.id;
      console.log(`VU ${vu}: User1 ${user1.username} signed up successfully with ID: ${user1.id}`);
    } else {
      console.error(`VU ${vu}: User1 signup failed:`, signup1.body);
    }

    // Signup User 2
    const signup2 = http.post(`${BASE_URL}/signup`, JSON.stringify(user2), { headers });
    check(signup2, {
      "user2 signup success": (r) => r.status === 201,
      "user2 signup has token": (r) => r.json("token") !== undefined,
      "user2 signup has user": (r) => r.json("user") !== undefined,
    });

    if (signup2.status === 201) {
      const responseBody = signup2.json();
      user2.token = responseBody.token;
      user2.id = responseBody.user.id;
      console.log(`VU ${vu}: User2 ${user2.username} signed up successfully with ID: ${user2.id}`);
    } else {
      console.error(`VU ${vu}: User2 signup failed:`, signup2.body);
    }

    // Test Login with User 1 (verify login flow works)
    if (user1.email && user1.password) {
      const login1 = http.post(
        `${BASE_URL}/login`,
        JSON.stringify({ email: user1.email, password: user1.password }),
        { headers },
      );
      check(login1, {
        "user1 login success": (r) => r.status === 200,
        "user1 login has token": (r) => r.json("token") !== undefined,
      });

      if (login1.status === 200) {
        console.log(`VU ${vu}: User1 ${user1.username} logged in successfully`);
      }
    }

    state.set(vu, { user1, user2, followed: false, postsCreated: 0 });
  }

  const vuState = state.get(vu);
  const { user1, user2, followed } = vuState;

  if (!user1.token || !user2.token || !user1.id || !user2.id) {
    console.error(`VU ${vu}: Missing authentication data, skipping iteration`);
    return; // Skip if authentication failed
  }

  // Test: Create Post (with unique content per iteration)
  const postContent = `Post #${vuState.postsCreated + 1} by ${user1.username} at ${new Date().toISOString()}`;
  const createPost = http.post(`${BASE_URL}/posts`, JSON.stringify({ content: postContent }), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user1.token}`,
    },
  });
  check(createPost, {
    "create post success": (r) => r.status === 201,
    "create post has id": (r) => r.json("id") !== undefined,
  });

  if (createPost.status === 201) {
    vuState.postsCreated++;
  }

  // Test: Follow User (only once per VU)
  if (!followed) {
    const followUser = http.post(`${BASE_URL}/user/follow/${user1.id}`, null, {
      headers: {
        Authorization: `Bearer ${user2.token}`,
      },
    });
    check(followUser, {
      "follow user success": (r) => r.status === 201 || r.status === 409, // 409 if already following
    });

    if (followUser.status === 201) {
      console.log(`VU ${vu}: User2 ${user2.username} is now following User1 ${user1.username}`);
      vuState.followed = true;
    } else if (followUser.status === 409) {
      console.log(`VU ${vu}: User2 ${user2.username} already following User1 ${user1.username}`);
      vuState.followed = true;
    }
  }

  // Test: Get Posts (Public Feed)
  const getPosts = http.get(`${BASE_URL}/posts?limit=20`);
  check(getPosts, {
    "get posts success": (r) => r.status === 200,
    "get posts has data": (r) => r.json("posts") !== undefined,
  });

  // Test: Get User Posts
  const getUserPosts = http.get(`${BASE_URL}/user/${user1.id}/posts`, {
    headers: {
      Authorization: `Bearer ${user2.token}`,
    },
  });
  check(getUserPosts, { "get user posts success": (r) => r.status === 200 });

  // Test: Update Profile (occasionally)
  if (iteration % 5 === 0) {
    // Every 5th iteration
    const updateProfile = http.put(
      `${BASE_URL}/user/profile`,
      JSON.stringify({
        name: `Updated ${user1.name} #${iteration}`,
        bio: `Bio updated at ${new Date().toISOString()}`,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user1.token}`,
        },
      },
    );
    check(updateProfile, { "update profile success": (r) => r.status === 200 });
  }

  sleep(Math.random() * 2 + 0.5); // Random sleep between 0.5-2.5 seconds
}

// Setup function to run before the test
export function setup() {
  console.log("🚀 Starting SocialScale load test...");
  console.log(`Target URL: ${BASE_URL}`);

  // Test if server is running
  const healthCheck = http.get(`${BASE_URL}/health`);
  if (healthCheck.status !== 200) {
    throw new Error(
      `❌ Server not available. Health check failed with status: ${healthCheck.status}`,
    );
  }

  console.log("✅ Server is healthy, starting test execution...");
  console.log("📊 Test will simulate user signups, posts, follows, and feed access");
  return {};
}

// Teardown function to run after the test
export function teardown(data) {
  console.log("✅ Load test completed!");
  console.log("📈 Check the results above for performance metrics");
}
