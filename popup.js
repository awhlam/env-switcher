document.addEventListener('DOMContentLoaded', function() {
  const subdomainSelect = document.getElementById('subdomainSelect');
  const switchButton = document.getElementById('switchButton');

  // Get the current tab's URL when popup opens
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentUrl = tabs[0].url;
    const urlParts = new URL(currentUrl);
    const hostParts = urlParts.hostname.split('.');

    // If we have a subdomain that matches one of our options, select it
    if (hostParts.length > 2) {
      const currentSubdomain = hostParts[0];
      const options = Array.from(subdomainSelect.options);
      const matchingOption = options.find(option => option.value === currentSubdomain);
      if (matchingOption) {
        subdomainSelect.value = currentSubdomain;
      }
    }
  });

  switchButton.addEventListener('click', function() {
    const newSubdomain = subdomainSelect.value;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentUrl = tabs[0].url;
      const urlParts = new URL(currentUrl);
      const hostParts = urlParts.hostname.split('.');

      // Replace the first part (subdomain) with the new one
      hostParts[0] = newSubdomain;

      // Construct the new URL
      const newHostname = hostParts.join('.');
      const newUrl = `${urlParts.protocol}//${newHostname}${urlParts.pathname}${urlParts.search}`;

      // Navigate to the new URL
      chrome.tabs.update({url: newUrl});
    });
  });
});