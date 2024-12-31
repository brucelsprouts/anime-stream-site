document.getElementById('test-button').addEventListener('click', async () => {
  try {
      const response = await fetch('/test-api');
      const data = await response.json();

      if (data.success) {
          document.getElementById('result').innerHTML = `
              <h2>API is working!</h2>
              <p>Here is the first anime result:</p>
              <p><strong>Title:</strong> ${data.data.title}</p>
              <p><strong>URL:</strong> <a href="${data.data.url}" target="_blank">${data.data.url}</a></p>
          `;
      } else {
          document.getElementById('result').innerHTML = `
              <p>Error: ${data.message}</p>
          `;
      }
  } catch (err) {
      console.error('Error:', err);
      document.getElementById('result').innerHTML = `<p>Error fetching data.</p>`;
  }
});
