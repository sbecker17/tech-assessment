const express = require("express");
const router = express.Router();
const Customer = require("../models/customer_model");

router.get("/", async (req, res) => {
	try{
		const customers = await Customer.find();
		res.send(customers);
	}
	catch (err) {
		res.status(500).json({message:err.message});
	}
});

router.post("/:lastName", async (req, res) => {
	res.status(400).json({message:"Please post to customers/"});
});

router.post("/", async (req, res) => {
    for (var i = 0; i<req.body.length; i++){
        const body1 = req.body[i];
        for (var info in body1){
            let temp;
            if (typeof body1[info] === "string"){
                temp = body1[info];
                temp = temp.toUpperCase();
                body1[info]=temp;
            }
            if (typeof body1[info] === "object"){
                for (var item in body1[info]){
                    if (typeof body1[info][item] === "string"){
                        temp = body1[info][item];
                        temp = temp.toUpperCase();
                        body1[info][item]=temp;
                    }
                }
            }
        }
        const address = body1.address.streetAddress + " " + body1.address.city + " " + body1.address.state + " " + body1.address.postalCode;
        const customer = new Customer({
            firstName: body1.firstName,
            lastName: body1.lastName,
            age: body1.age,
            address: address,
            streetAddress: body1.address.streetAddress,
            city: body1.address.city,
            state: body1.address.state,
            postalCode: body1.address.postalCode,
            phoneNumber: body1.phoneNumber
        });
        try{
            const newCustomer = await customer.save();
            // res.status(201).json(newCustomer);
        }
        catch(err) {
            res.status(400).json({message:err.message});
        }
    }
    res.status(201).json({message:"Customer(s) Added"});
});

router.get("/:lastName", getCustomer, async (req, res) => {
	if (res.customer != null) {
		res.json(res.customer);
	}
	else{
        console.log(res.customer);
		res.json({message: "Cannot locate customer with that name"});
	}
});

router.delete("/:lastName", getCustomer, async (req, res) => {
	try{
		await res.customer.remove();
		res.json({message: "Successfully deleted customer"});
	}
	catch (err) {
		res.status(500).json({message: err.message});
	}
});

router.delete("/", async (req, res) => {
    try{
		const customers = await Customer.find();
        for (var i=0; i<customers.length; i++) {
            await customers[i].remove();
        }
        res.status(200).json({message: "Deleted all customers successfully"});
	}
	catch (err) {
		res.status(500).json({message:err.message});
	}
});

router.patch("/:lastName", getCustomer, async (req, res) => {
	if (req.body.firstName != null) {
		res.customer.firstName = req.body.firstName.toUpperCase();
	}
	if (req.body.lastName != null) {
		res.customer.lastName = req.body.lastName.toUpperCase();
	}
    if (req.body.age != null) {
		res.customer.age = req.body.age;
	}
	if (req.body.address != null) {
		res.customer.address = req.body.address.toUpperCase();
        // i realize this won't update the address field if a subfield is changed
	}
	if (req.body.streetAddress != null) {
		res.customer.streetAddress = req.body.streetAddress.toUpperCase();
	}
	if (req.body.city != null) {
		res.customer.city = req.body.city.toUpperCase();
	}
	if (req.body.state != null) {
		res.customer.state = req.body.state.toUpperCase();
	}
	if (req.body.postalCode != null) {
		res.customer.postalCode = req.body.postalCode;
	}
	if (req.body.phoneNumber != null) {
		res.customer.phoneNumber = req.body.phoneNumber;
	}
	try {
		const updatedCustomer = await res.customer.save();
		res.json(updatedCustomer);
	}
	catch (err) {
		res.status(400).json({message:err.message});
	}
});

async function getCustomer(req, res, next) {
	let customer1;
	let lastName = req.params.lastName.toUpperCase();
    try{
        customer1 = await Customer.find({'lastName': lastName});
        // customer = await Customer.findById(req.params.lastName);
        if (customer1 == null) {
            return res.status(303).json({message:"Cannot find customer"});
        }
    }
    catch (err) {
        // console.log(err + ` in getCustomer`)
        return res.status(500).json({message: err.message});
    }
    res.customer = customer1[0];
    next();
}


module.exports = router;