export async function apiRequest(baseUrl, path, method = "GET", body = null) {
  const options = { method, headers: {} };
  if (body !== null) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, options);
  } catch {
    throw new Error(unreachableMessage(baseUrl));
  }

  if (response.status === 204) return null;

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

function unreachableMessage(baseUrl) {
  try {
    const { hostname, port } = new URL(baseUrl);
    const host = port ? `${hostname}:${port}` : hostname;
    const name =
      {
        8081: "User Service",
        8082: "Flight Service",
        8083: "Hotel Service",
        8084: "Itinerary Service",
      }[port] || "backend service";
    return `Could not reach ${name} (${host}). Is it running?`;
  } catch {
    return "Could not reach the backend. Is it running?";
  }
}
