const stk =  require("./collections").stk;
// var ObjectId = require('mongodb').ObjectID;
const drop = async function (){
	const ac = await stk();
	await ac.deleteMany({});
}
const create_object = function create_object(id,ticker,company, sector){	
	return {
		_id : id,
		ticker: ticker,
		company: company,
		price: Math.random()*1000.0,
		sector: sector,
		open: Math.random()*1000.0,
		yield:Math.random()*10.0,
		marketCap: Math.random()*100000000000.0
	};

};
const create = async function create(id,ticker,company, sector){
	var obj = create_object(id,ticker,company, sector);
	const ac = await stk();
	const insertInfo = await ac.insertOne(obj);
	if(insertInfo.insertedCount==0){
		throw "Could not add animal";
	}
	return await ac.findOne({_id: insertInfo.insertedId});
};


const getByTicker = async function getByTicker(ticker){


	const ac = await stk();
	const stkResult = await ac.findOne({ticker:ticker});
	if(stkResult===null){
		throw ("no stock with given ticker "+ticker);
	}
	return stkResult;
};

const getByCompany = async function getByCompany(company){


	const ac = await stk();
	const stkResult = await ac.findOne({company:company});
	if(stkResult===null){
		throw ("no stock with given company "+company);
	}
	return stkResult;
};
const getByID = async function getByID(id){
	const ac = await stk();
	const stkResult = await ac.findOne({_id : id});
	if(stkResult===null){
		throw ("no stock with given id "+id);
	}
	return stkResult;
}
const update = async function update(id, price){
	const ac = await stk();
	let new_obj = {$set:{
		price: price
	}};
	const update_info = await ac.updateOne({_id: id},new_obj);
	if(update_info.modifiedCount===0){
		throw ("no stock of id "+ id+ " was updated");
	}
	return await getByID(id);
};

module.exports = {
	
	create,
	getByTicker,
	getByCompany,
	getByID,
	update,
	drop


}