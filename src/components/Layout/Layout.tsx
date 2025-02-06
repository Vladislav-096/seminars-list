import { SeminarsTable } from "../SeminarsTable/SeminarsTable";

export const Layout = () => {
  return (
    <div className="page">
      <main>
        <div className="container">
          <SeminarsTable />
        </div>
      </main>
    </div>
  );
};
