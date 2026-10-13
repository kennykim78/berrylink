// Figma fileKey 2qHyJkdoIzMQS78p3KIs0n, node 1:34 (Frame 1, hero) - raw get_design_context output
const imgBLogo1 = "https://www.figma.com/api/mcp/asset/939b0e2e-7537-4dac-84e6-812788b1b3c3.svg";

export default function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center justify-center overflow-clip px-[179px] py-[67px] relative rounded-[2px] size-full" data-node-id="1:34">
      <div className="absolute content-stretch flex flex-col h-[885px] items-start left-[179px] p-[10px] top-[97px] w-[1562px]" data-node-id="1:32">
        <div className="aspect-[1920/1080] relative shrink-0 w-full" data-node-id="1:30" data-name="vecteezy_dark-abstract-3d-form-resembling-a-crystal-or-fluid_81820206 1" />
      </div>
      <div className="content-stretch flex flex-col gap-[15px] items-center relative shrink-0 w-[969px]" data-node-id="1:20">
        <div className="h-[216px] relative shrink-0 w-[772px]" data-node-id="1:8" data-name="b_logo 1">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBLogo1} />
        </div>
        <div className="font-['Abhaya_Libre:Regular'] text-[64px] text-center text-white" data-node-id="1:19">
          <p className="leading-[normal] mb-0">K-Beauty Brand Production Agency </p>
          <p className="leading-[normal]">for CIS & Islamic Markets   </p>
        </div>
      </div>
      <p className="absolute font-['Pretendard_Variable:Medium'] left-[959.5px] text-[16px] text-center text-white top-[30px]" data-node-id="10:10">
        <span className="leading-[1.6]">KO </span>
        <span className="leading-[1.6] text-[#555]">| EN | RU</span>
      </p>
    </div>
  );
}
