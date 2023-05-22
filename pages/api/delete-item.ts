import { NextApiRequest, NextApiResponse } from "next";
import apiserver from "../../lib/api/apiserver";
import { respType } from "../../lib/interfaces";

const DeleteItem = async (req:NextApiRequest,res:NextApiResponse<respType>) => {
    const token: string = req.query.token ? req.query.token as string : "";
    let response: respType = {status: false,message:'Oauth token not found'}

    const { itemId } = req.body;
    if(itemId && token)
    {
        let mess = 'Server access error';
        try
        {
            const { data } = await apiserver.delete(`/api/user-settings/${parseInt(itemId)}?token=${token}`);
            console.log(data);
            if(data){
                mess = data.message;
                response.status = data.status;
            }
        }
        catch(e: any){
            console.log(e);
        }
        response.message = mess;
    }
    res.status(200).json(response);
    return;
}
export default DeleteItem;