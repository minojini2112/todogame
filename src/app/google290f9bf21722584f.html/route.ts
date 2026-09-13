const BODY = "google-site-verification: google290f9bf21722584f.html\n";

export function GET() {
  return new Response(BODY, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
