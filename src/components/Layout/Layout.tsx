import { SeminaresTable } from "../SeminaresTable/SeminaresTable";

export const Layout = () => {
  return (
    <div className="page">
      <main>
        <div className="container">
          <SeminaresTable />
        </div>
      </main>
    </div>
  );
};
