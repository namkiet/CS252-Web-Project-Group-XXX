document.getElementById('btn').addEventListener('click', async () => {
  const city = document.getElementById('city').value.trim();
  if (!city) return alert("Vui lòng nhập thành phố!");

  const res = await fetch('http://localhost:5000/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city })
  });
  const data = await res.json();

  document.getElementById('result').innerHTML = `<h2>${data.city}</h2><p>${data.dish}</p>`;
});
