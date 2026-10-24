const apiKey = "vach_1ytE2CY5X2OtlnsfUU7svHoNhJtO0JQi3mRqA4m2DF87aee3esafAlOzHiBbd4mmWIDb5hJvj9yA9qqJs6GgAMTqoBkdyq7Z_7b608b5e1b95871558faa2c082a5a44f";

async function testLLM() {
  console.log("=== Testing LLM chat completions with provided key ===");
  const targets = [
    "https://api.inya.ai/v1/chat/completions",
    "https://api.inya.ai/api/v1/chat/completions",
    "https://api.vachana.ai/v1/chat/completions",
    "https://api.vachana.ai/api/v1/chat/completions"
  ];

  for (const url of targets) {
    try {
      console.log(`Testing: ${url}`);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key-ID": apiKey
        },
        body: JSON.stringify({
          model: "gnani-evon",
          messages: [{ role: "user", content: "Hello" }]
        })
      });
      console.log(`Status: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.log(`Response:`, text.slice(0, 200));
    } catch (e) {
      console.log(`Error:`, e.message);
    }
  }
}

testLLM();
