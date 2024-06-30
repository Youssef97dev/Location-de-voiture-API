import CarList from "../components/CarList";

export default function Home() {
  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold mb-6">Welcome to Car Rental Service</h1>
      <CarList />
    </div>
  );
}
