import Header from "../components/Header";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />

      {/* pt-20 để tránh nội dung bị Header che (do Header thường là fixed/sticky) */}

      <main className="pt-20 min-h-screen bg-[#F5F8FC]">{children}</main>
    </>
  );
};

export default MainLayout;
