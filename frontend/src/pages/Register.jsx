async function submit(e) {
  e.preventDefault();
  try {
    await axios.post("http://localhost:5000/auth/register", form);
    alert("Registered successfully. Please login.");
    navigate("/login");
  } catch {
    alert("Authentication failed");
  }
}
