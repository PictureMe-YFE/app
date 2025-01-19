import { getQrCode } from "@/actions/qrCode.actions";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

const QrPlayPage = async ({ params }) => {

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const qrCode = await getQrCode(params.uuid)
    if (!qrCode.success && qrCode.notAssigned) {
        redirect(`/qr/${params.uuid}/verify`)
    }
    console.log(qrCode)

    return (
        <div className="p-6 text-white bg-black">
            <h1 className="text-2xl">QrPlayPage</h1>
            <p>Ceci est la future gallerie du boug</p>

        </div>
    );
}

export default QrPlayPage