// API test script
const API_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('Testing API connection...');

  try {
    // Test recipes endpoint
    console.log('Testing recipes endpoint...');
    const recipesResponse = await fetch(`${API_URL}/recipes`);
    const recipesData = await recipesResponse.json();

    console.log('Recipes API response:', recipesData);

    if (recipesData.success) {
      console.log(`✅ Recipes API working! Found ${recipesData.data.length} recipes.`);
      document.getElementById('api-test-results').innerHTML = `
        <div class="success">
          <h3>API Connection Successful</h3>
          <p>Found ${recipesData.data.length} recipes.</p>
          <p>Try refreshing the main page now.</p>
        </div>
      `;
    } else {
      console.error('❌ Recipes API returned success: false');
      document.getElementById('api-test-results').innerHTML = `
        <div class="error">
          <h3>API Connection Problem</h3>
          <p>The API returned success: false</p>
          <p>Error: ${recipesData.message || 'No error message provided'}</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('❌ API Test Failed:', error);
    document.getElementById('api-test-results').innerHTML = `
      <div class="error">
        <h3>API Connection Failed</h3>
        <p>${error.message}</p>
        <p>Make sure the API server is running on port 3000.</p>
      </div>
    `;
  }
}

// Run test when the page loads
window.addEventListener('DOMContentLoaded', testAPI); 