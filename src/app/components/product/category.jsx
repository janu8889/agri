import { FaTractor, FaCogs } from "react-icons/fa";
import { GiTowTruck } from "react-icons/gi";
import ExcavatorBucketIcon from "../icons/ExcavatorBucketIcon"

export default function CategorySeparator({ category }) {
  let IconComponent;

  switch (category) {
    case "agriculture":
      IconComponent = FaTractor;
      break;
    case "construction":
      IconComponent = GiTowTruck;
      break;
    case "attachments":
      IconComponent = ExcavatorBucketIcon;
      break;
    default:
      IconComponent = null;
  }

  return (
    <div className="flex justify-center items-center my-8 gap-2">
      <hr className="border-t-2 border-[#c9a227] flex-grow rounded-full" />
        {IconComponent && (
        <div className="p-2 bg-[#fff7e1] rounded-full shadow-md">
            <IconComponent className="text-[#c9a227] text-4xl" />
        </div>
        )}
      <hr className="border-t-2 border-[#c9a227] flex-grow rounded-full" />
    </div>
  );
}