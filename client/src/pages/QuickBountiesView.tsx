import useBounties from "@/hooks/useBounties";
import BountyTable from "@/components/BountyTable";
import { columns } from "@/lib/bounties-columns";
import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import MobileMenuOverlay from "@/components/MobileMenu";
import { createPortal } from "react-dom";

function QuickBountiesView() {
  const { allBounties } = useBounties();
  const [menuOpen, setMenuOpen] = useState(false);
  const tableData = useMemo(() => {
    return allBounties || [];
  }, [allBounties]);
  return (
    <div
      style={{ fontFamily: "KarlaRegular" }}
      className="max-w-[1240px] mx-auto my-0"
    >
      <Navbar onMenuClick={() => setMenuOpen(true)} />
      <div className="w-full my-10 mt-12 mx-2 md:mx-4 flex flex-col gap-2">
        <h1 className="text-5xl" style={{ fontFamily: "RubikBrokenFax" }}>
          Content is Currency. Cash In
        </h1>
        <p
          className="text-xl leading-relaxed text-gray-400"
          style={{ fontFamily: "KarlaRegular" }}
        >
          Because exposure doesn’t pay the bills.
          <br />
        </p>
      </div>
      {menuOpen &&
        createPortal(
          <MobileMenuOverlay onClose={() => setMenuOpen(false)} />,
          document.body
        )}
      <div className="mt-8 mx-2 md:mx-4">
        <BountyTable columns={columns} data={tableData} />
      </div>
    </div>
  );
}

export default QuickBountiesView;
