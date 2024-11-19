import Banner from "../components/Banner";
import NewHeader from "../components/Newheader";
import Search from "../components/Search";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";

const Home = () => {
  return (
    <div>
      <NewHeader />
      {/* <Header /> */}
      <Search />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </div>
  );
};

export default Home;
