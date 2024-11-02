import GridLoader from "react-spinners/GridLoader";

const Loader = () => {
  return (
    <div className="flex place-content-center items-center h-full w-full">
      <GridLoader color="#16a34a" size={20} />
    </div>
  )
}

export default Loader