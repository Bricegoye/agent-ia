import {
  assertSafePublicUrl,
} from "../lib/security/url-safety";

interface TestCase {
  url: string;
  expected: "allowed" | "blocked";
}

const testCases: TestCase[] = [
  {
    url: "https://example.com/",
    expected: "allowed",
  },
  {
    url: "https://www.peugeot.fr/",
    expected: "allowed",
  },
  {
    url: "http://localhost/",
    expected: "blocked",
  },
  {
    url: "http://127.0.0.1/",
    expected: "blocked",
  },
  {
    url: "http://10.0.0.1/",
    expected: "blocked",
  },
  {
    url: "http://192.168.1.1/",
    expected: "blocked",
  },
  {
    url: "http://172.16.0.1/",
    expected: "blocked",
  },
  {
    url: "http://[::1]/",
    expected: "blocked",
  },
  {
    url: "ftp://example.com/",
    expected: "blocked",
  },
  {
    url: "https://user:password@example.com/",
    expected: "blocked",
  },
];

async function main() {
  let failures = 0;

  console.log(
    "\nTest de sécurité des URLs\n"
  );

  for (const testCase of testCases) {
    try {
      const safeUrl =
        await assertSafePublicUrl(
          testCase.url
        );

      if (testCase.expected === "allowed") {
        console.log(
          `✅ Autorisée : ${safeUrl.toString()}`
        );
      } else {
        failures += 1;

        console.error(
          `❌ Devait être bloquée : ${testCase.url}`
        );
      }
    } catch (error) {
      if (testCase.expected === "blocked") {
        console.log(
          `✅ Bloquée : ${testCase.url}`
        );
      } else {
        failures += 1;

        console.error(
          `❌ Devait être autorisée : ${testCase.url}`
        );

        console.error(
          error instanceof Error
            ? error.message
            : error
        );
      }
    }
  }

  if (failures > 0) {
    throw new Error(
      `${failures} test(s) de sécurité ont échoué.`
    );
  }

  console.log(
    "\nTous les tests de sécurité sont réussis."
  );
}

main().catch((error: unknown) => {
  console.error(
    "\nÉchec du test de sécurité :"
  );

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
});