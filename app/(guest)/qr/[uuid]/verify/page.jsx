import {  isAssignedShirtVerify } from '@/actions/qrCode.actions'
import VerifyComponent from '@/components/VerifyComponent'
import React from 'react'
import { redirect } from 'next/navigation'

const VerifyPage = async ({params}) => {
    const isNotAssigned = await isAssignedShirtVerify(params.uuid)

    if (!isNotAssigned) {
        redirect(`/qr/${params.uuid}`)
    }
    return (

        <div>
            <VerifyComponent uuid={params.uuid}/>
        </div>

    )
}

export default VerifyPage