import VerifyComponent from '@/components/VerifyComponent'
import React from 'react'

const VerifyPage = async ({params}) => {

    return (

        <div>
            <VerifyComponent uuid={params.uuid}/>
        </div>

    )
}

export default VerifyPage