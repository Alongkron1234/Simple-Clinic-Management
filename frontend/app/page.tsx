
import axios from 'axios';

export default async function Home() {
  let doctors = [];
  try {
    const res = await axios.get('http://localhost:8000/public/doctor');
    doctors = res.data;
  } catch (err) {
    console.error("Error fetching doctors:", err);
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-5">Clinic Connect (Server Side)</h1>
      <ul>
        {doctors.map((doc) => (
          <li key={doc.doc_id} className="border-b py-2">
            นพ. {doc.firstname} {doc.lastname}
          </li>
        ))}
      </ul>
    </main>
  );
}