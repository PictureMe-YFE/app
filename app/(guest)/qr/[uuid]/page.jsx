import { getQrCode } from "@/actions/qrCode.actions";
import TakePhoto from "@/components/TakePhoto";
import TakePhotoPermission from "@/components/TakePhotoPermission";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

const QrPlayPage = async ({ params, searchParams }) => {


    const qrCode = await getQrCode(params.uuid)
    if (!qrCode.success && qrCode.notAssigned) {
        redirect(`/qr/${params.uuid}/verify`)
    }
    console.log(qrCode)

    return (
        // <TakePhoto />
        <TakePhotoPermission />
    );
}

export default QrPlayPage