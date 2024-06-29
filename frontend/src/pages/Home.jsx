import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    localStorage.getItem("session_id");
    fetch("http://localhost:8000/get", {
      method: 'POST',
      headers: {
        'Content-type': "application/json",
        'Authorization': `Bearer ${localStorage.getItem("session_id")}`
      }
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  })
  return (<div>

  </div>)
}