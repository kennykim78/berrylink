// Figma get_design_context raw output. fileKey 2qHyJkdoIzMQS78p3KIs0n, parent 10:7, content node 25:363
// Title 25:364: Abhaya Libre Regular 64px, white, centered, line-height normal. Grid 25:365: flex-wrap, gap 30, justify-center, w 1400.
// Each logo: 200 x 66.667 box, <img class="absolute inset-0 object-cover size-full"> (DPPR 25:367: 200 x 60.241 SVG frame).
// Logos in order (25:366..25:383): 9, Frame(DPPR svg), 04_tocobo 1, 11, 15, 16, 02_manyo 1, 09_sosohanmi 1, 08_by_our 1, 05_haruharu_wonder 1, 17, 18, 19, 01_anua 1
// (asset URLs omitted/expired; downloaded to assets/images/brands/)
export default function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start relative size-full" data-node-id="25:363">
      <p className="font-['Abhaya_Libre:Regular'] leading-[normal] text-[64px] text-center text-white" data-node-id="25:364">Our Brands</p>
      <div className="content-start flex flex-wrap gap-[30px] items-start justify-center relative shrink-0 w-[1400px]" data-node-id="25:365">
        {/* 14 x <div className="h-[66.667px] min-w-[200px] w-[200px] relative"><img className="absolute inset-0 object-cover size-full" /></div> */}
      </div>
    </div>
  );
}
