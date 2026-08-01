import mongoose from "mongoose";

import Invoice from "../../model/invoice/invoice.model.js";
import Customer from "../../model/invoice/customer.model.js";
import Product from "../../model/invoice/product.model.js";

import { PAYMENT_STATUS } from "../../utils/invoice.constant.js";


class DashboardRepository {


    async getDashboardStats(userId) {


        const objectUserId = new mongoose.Types.ObjectId(userId);



        const [

            totalCustomers,

            totalProducts,

            totalInvoices,

            paidInvoices,

            pendingInvoices,

            overdueInvoices,

            amount


        ] = await Promise.all([



            Customer.countDocuments({
                userId
            }),



            Product.countDocuments({
                userId
            }),



            Invoice.countDocuments({
                userId
            }),



            Invoice.countDocuments({
                userId,
                paymentStatus: PAYMENT_STATUS.PAID
            }),



            Invoice.countDocuments({
                userId,
                paymentStatus: PAYMENT_STATUS.PENDING
            }),



            Invoice.countDocuments({

                userId,

                paymentStatus: PAYMENT_STATUS.PENDING,

                dueDate:{
                    $lt:new Date()
                }

            }),



            Invoice.aggregate([


                {
                    $match:{
                        userId:objectUserId
                    }
                },


                {
                    $group:{


                        _id:null,


                        totalRevenue:{


                            $sum:{


                                $cond:[


                                    {
                                        $eq:[
                                            "$paymentStatus",
                                            PAYMENT_STATUS.PAID
                                        ]
                                    },


                                    "$grandTotal",


                                    0


                                ]

                            }


                        },



                        totalDueAmount:{


                            $sum:{


                                $cond:[


                                    {
                                        $eq:[
                                            "$paymentStatus",
                                            PAYMENT_STATUS.PENDING
                                        ]
                                    },


                                    "$grandTotal",


                                    0


                                ]

                            }

                        }


                    }

                }


            ])

        ]);





        return {


            totalCustomers,

            totalProducts,

            totalInvoices,

            paidInvoices,

            pendingInvoices,

            overdueInvoices,

            totalRevenue:
                amount[0]?.totalRevenue || 0,


            totalDueAmount:
                amount[0]?.totalDueAmount || 0


        };


    }






    async getInvoiceList(userId, options){


        const {

            page=1,

            limit=10,

            search="",

            paymentStatus,

            customerId,

            startDate,

            endDate,

            sortBy="createdAt",

            sortOrder="desc"


        }=options;



        const filter={

            userId:new mongoose.Types.ObjectId(userId)

        };




        if(search){


            filter.$or=[


                {

                    invoiceNumber:{
                        $regex:search,
                        $options:"i"
                    }

                },


                {

                    "customer.customerName":{
                        $regex:search,
                        $options:"i"
                    }

                }


            ];


        }





        if(paymentStatus){

            filter.paymentStatus=paymentStatus;

        }





        if(customerId){

            filter.customerId =
                new mongoose.Types.ObjectId(customerId);

        }





        if(startDate || endDate){


            filter.createdAt={};



            if(startDate){

                filter.createdAt.$gte =
                    new Date(startDate);

            }



            if(endDate){

                filter.createdAt.$lte =
                    new Date(endDate);

            }


        }





        const invoices = await Invoice
            .find(filter)
            .sort({

                [sortBy]:
                sortOrder==="asc"?1:-1

            })
            .skip(
                (Number(page)-1) *
                Number(limit)
            )
            .limit(Number(limit))
            .lean();





        const totalInvoices =
            await Invoice.countDocuments(filter);





        return {


            invoices,


            pagination:{


                totalInvoices,


                currentPage:Number(page),


                totalPages:
                Math.ceil(
                    totalInvoices /
                    Number(limit)
                ),


                limit:Number(limit)


            }


        };


    }







    async getRevenueChart(userId){


        return Invoice.aggregate([


            {

                $match:{

                    userId:
                    new mongoose.Types.ObjectId(userId),

                    paymentStatus:
                    PAYMENT_STATUS.PAID

                }

            },


            {

                $group:{


                    _id:{


                        year:{
                            $year:"$createdAt"
                        },


                        month:{
                            $month:"$createdAt"
                        }


                    },


                    totalRevenue:{
                        $sum:"$grandTotal"
                    },


                    totalInvoices:{
                        $sum:1
                    }


                }


            },


            {

                $sort:{

                    "_id.year":1,

                    "_id.month":1

                }

            }


        ]);


    }







    async getInvoiceStatusChart(userId){


        return Invoice.aggregate([


            {

                $match:{

                    userId:
                    new mongoose.Types.ObjectId(userId)

                }

            },


            {

                $group:{


                    _id:"$paymentStatus",


                    totalInvoices:{
                        $sum:1
                    }


                }

            }


        ]);


    }







    async getTopCustomers(userId){


        return Invoice.aggregate([


            {

                $match:{


                    userId:
                    new mongoose.Types.ObjectId(userId),


                    paymentStatus:
                    PAYMENT_STATUS.PAID


                }

            },



            {

                $group:{


                    _id:"$customerId",


                    customerName:{
                        $first:"$customer.customerName"
                    },


                    customerEmail:{
                        $first:"$customer.email"
                    },


                    totalInvoices:{
                        $sum:1
                    },


                    totalRevenue:{
                        $sum:"$grandTotal"
                    }


                }

            },



            {

                $sort:{

                    totalRevenue:-1

                }

            },


            {

                $limit:5

            }


        ]);


    }







    async getTopProducts(userId){


        return Invoice.aggregate([


            {

                $match:{


                    userId:
                    new mongoose.Types.ObjectId(userId),


                    paymentStatus:
                    PAYMENT_STATUS.PAID


                }

            },



            {

                $unwind:"$items"

            },



            {

                $group:{


                    _id:"$items.productId",


                    productName:{
                        $first:"$items.productName"
                    },


                    totalQuantitySold:{
                        $sum:"$items.quantity"
                    },


                    totalRevenue:{
                        $sum:"$items.total"
                    }


                }

            },



            {

                $sort:{

                    totalRevenue:-1

                }

            },



            {

                $limit:5

            }


        ]);


    }






    async getRecentInvoices(userId){


        return Invoice.find({

            userId

        })

        .sort({

            createdAt:-1

        })

        .limit(5)

        .select(
            "invoiceNumber customer grandTotal paymentStatus dueDate createdAt"
        )

        .lean();


    }



}


export default new DashboardRepository();