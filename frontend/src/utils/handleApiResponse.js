export const handleApiResponse = async (res, defaultMessage) => {
  const contentType = res.headers.get("content-type") || "";
  let result;

  if (contentType.includes("application/json")) {
    try {
      result = await res.json();
    } catch {
      result = {};
    }
  } else {
    const text = await res.text();
    result = text ? { data: text } : {};
  }

  if (
    !res.ok ||
    result.success === false ||
    (result.statusCode && result.statusCode > 299)
  ) {
    const backendMessage = result?.message || result?.title || defaultMessage;

    throw new Error(`${backendMessage}`);
  }

  return result;
};
