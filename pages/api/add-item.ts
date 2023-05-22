import { NextApiRequest, NextApiResponse } from "next";
import { respType } from "../../lib/interfaces";
import axios from "axios";

type addItemType = {
    itemType: string;
    itemKey: string;
    itemValue: string;
}
const BASE_URL = process.env.DOCKER_API_HOST;

const AddItem = async (req:NextApiRequest,res:NextApiResponse<respType>) => {
    const token: string = req.query.token ? req.query.token as string : "";
    let response: respType = {status: false,message:'Oauth token not found'}

    const payload: addItemType = req.body;
    if(token)
    {
        console.log(token);
        let mess = 'Required data not found';
        try
        {
            if(payload.itemType && payload.itemKey && payload.itemValue){
                mess = 'Server access error';
                let url = `${BASE_URL}/api/user-settings`;
                await axios({
                    method: 'POST',
                    url: url,
                    data: payload,
                    headers: {
                        'Authorization': 'Bearer '+token
                    }
                }).then(result => {
                    const results = result.data;
                    response.status = results.status;
                    mess = results.message;
                    if(!results.status){
                        if(mess.toLowerCase() === 'validation error'){
                            if("itemType" in results.data){
                                mess = results.data['itemType'][0];
                            }
                            if("itemKey" in results.data){
                                mess = results.data['itemKey'][0];
                            }
                            if("itemValue" in results.data){
                                mess = results.data['itemValue'][0];
                            }
                        }
                    }
                    else  response.data = results.data.item_id;
                }).catch(err => {
                    const errResult = err.response.data;
                    mess = errResult.message;
                });
            }
        }
        catch(e: any){
            console.log(e);
            mess = 'Operation error';
        }
        response.message = mess;
    }
    res.status(200).json(response);
    return;
}
export default AddItem;