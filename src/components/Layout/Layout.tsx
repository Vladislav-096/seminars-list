import { SeminarsTable } from "../SeminarsTable/SeminarsTable";

export const Layout = () => {
  return (
    <div className="page">
      <main>
        <section style={{paddingTop: "20px"}}>
          <div className="container">
            <SeminarsTable />
          </div>
        </section>
      </main>
    </div>
  );
};
