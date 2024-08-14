import { grid } from "ldrs";
export default function Spinner() {
  grid.register();
  return (
    <div className="flex justify-center items-center h-screen">
      <l-grid size="70" speed="1.5" color="#95e138"></l-grid>
    </div>
  );
}
