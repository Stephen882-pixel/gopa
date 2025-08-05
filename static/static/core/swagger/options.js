(function () {
  // Preferred layout
  swaggerUiConfig.layout = "BaseLayout";
  // Deal with the CSRF need
  swaggerUiConfig.responseInterceptor = function (response) {
    const check = new URL(response.url).pathname;
    if ("/api/auth/token" !== check && "/api/auth/login" !== check) {
      return response;
    }
    document.querySelector("[name=csrfmiddlewaretoken]").value =
      response.body.csrf;
    return response;
  };
})();
