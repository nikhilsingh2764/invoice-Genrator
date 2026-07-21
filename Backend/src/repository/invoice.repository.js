import Invoice from "../model/invoice.model.js";

class InvoiceRepository {

    async create(userData) {
        return await Invoice.create(userData);
    }


    async findById(userId, invoiceId) {
        return await Invoice.findOne({ _id: invoiceId, userId });
    }

    async existsById(userId, invoiceId) {
        return await Invoice.exists({ _id: invoiceId, userId });
    }

    async updateById(userId, invoiceId, updatedData) {
        return await Invoice.findOneAndUpdate(
            {
                _id: invoiceId,
                userId
            },
            updatedData,
            {
                new: true,
                runValidators: true
            }
        );
    }

    async deleteById(userId, invoiceId) {
        return await Invoice.findOneAndDelete({ _id: invoiceId, userId, });
    }





    //filter,sort etc
    async findAllWithFilters(userId, filterOptions) {

        const {

            status,
            startDate,
            endDate,
            search,
            sortBy = "createdAt",
            sortOrder = "desc",
            page = 1,
            limit = 10

        } = filterOptions;

        const query = {
            userId
        };

        //filter by status
        if (status) {
            query.status = status
        }

        //filter by date range

        if (startDate || endDate) {

            query.createdAt = {};

            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }

            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }

        }

        //search customer

        if (search) {

            query.$or = [
                {
                    "customer.customerName": {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    "customer.email": {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    invoiceNumber: {
                        $regex: search,
                        $options: "i"
                    }

                },
            ]
        }


        //sorting
        const sort = {}

        sort[sortBy] = sortOrder === "asc" ? 1 : -1;

        //pagination

        const skip = (Number(page)-1) * Number(limit);

        const invoices = await Invoice
                               .find(query)
                               .sort(sort)
                               .skip(skip)
                               .limit(Number(limit))

        const totalInvoices = await Invoice.countDocuments(query);

        return {

            invoices,

            pagination: {

                totalInvoices,

                currentPage: Number(page),

                totalPages: Math.ceil(
                    totalInvoices / Number(limit)
                ),

                limit: Number(limit)

            }
        };


    }


}

export default new InvoiceRepository();