document.getElementById('btn').addEventListener('click', async () => {
  const city = document.getElementById('city').value.trim();
  if (!city) return alert("Vui lòng nhập thành phố!");

  try {
    const res = await fetch('http://localhost:5000/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city })
    });

    if (!res.ok) {
      throw new Error(`Server trả về lỗi: ${res.status}`);
    }

    const data = await res.json();
    document.getElementById('result').innerHTML = `<h2>${data.city}</h2><p>${data.dish}</p>`;
  } catch (err) {
    console.error(err);
    alert("Không thể kết nối tới server. Vui lòng thử lại sau!");
  }
});
