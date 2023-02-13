import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Image, Button } from "react-bootstrap";

import { IoBed } from "react-icons/io5";
import { GiBathtub } from "react-icons/gi";

import { useQuery } from "react-query";
import { API } from "lib/api";
import css from "./Detail.module.css";

import Layout from "layouts/withoutSearchbar";
import OrderModal from "components/Modals/Detail";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ModalLogin from "components/Modals/Login"
import { AppContext } from "context/AppContext";
// import { AppContext } from "context/AppContext";

export default function Detail(props) {
	const [showModal, setShowModal] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
	const [modalRegist, setModalRegist] = useState(false);
	const { id } = useParams();
	const redirect = useNavigate();
	const [state, dispatch] = useContext(AppContext);

	// const [state, dispatch] = useContext(AppContext);
	const Toast = Swal.mixin({
		toast: true,
		position: "top-end",
		showConfirmButton: false,
		timer: 5000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer);
			toast.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});

	let { data: property } = useQuery("detailPropertyCache", async () => {
		const response = await API.get("/property/" + id);
		return response.data.data;
	});

	let { data: myBooking } = useQuery("getBookingCache", async () => {
		const response = await API.get("/myBooking");
		return response.data.data;
	});

	const handleBooking = () => {

		if (!myBooking){
			setShowModal(true)
		} else {
			Toast.fire({
				icon: "error",
				title: "You have an unpaid order, please pay in advance before placing another order!",
			});
			redirect("/mybooking");
		}
	}

	

	console.log("data showed", property); 

	return (
		<Layout className={"bg-white"}>
			<div className={css.MaxWidth} style={{ marginTop: "4rem" }}>
				<div className='d-flex flex-column gap-3 w-100'>
					<div className={css.WrapperPrimaryImage}>
						<Image
							src={"http://localhost:5000/uploads/" + property?.image}
							className={css.PrimaryImage}
						/>
					</div>
					<div className='d-flex gap-3'>
						<div className={css.WrapperSubImage}>
							<Image
								src={process.env.PUBLIC_URL + "/img/rooms/image3.png"}
								className={css.PrimaryImage}
							/>
						</div>
						<div className={css.WrapperSubImage}>
							<Image
								src={process.env.PUBLIC_URL + "/img/rooms/image7.png"}
								className={css.PrimaryImage}
							/>
						</div>
						<div className={css.WrapperSubImage}>
							<span className={css.ImageMore}>+5</span>
							<Image
								src={process.env.PUBLIC_URL + "/img/rooms/image6.png"}
								className={css.PrimaryImage}
							/>
						</div>
					</div>
				</div>
				<div className={css.WrappingBookingDesc}>
					<h1 className={css.BookingTitle}>{property?.name}</h1>
					<div className={css.BookingDesc}>
						<div>
							<h3 className='fw-bold'>
								{property?.price} / {property?.type_rent}
							</h3>
							<p className='text-secondary' style={{ width: "360px" }}>
								{property?.address}, <br /> {property?.district},{" "}
								{property?.city.name}
							</p>
						</div>
						<div className=' d-flex gap-3'>
							<div className='fw-semibold'>
								<small className='text-secondary'>Bedrooms</small>
								<span className='d-flex align-items-center gap-2 fs-4'>
									{property?.bedroom} <IoBed />
								</span>
							</div>
							<div className='fw-semibold'>
								<small className='text-secondary'>Bathrooms</small>{" "}
								<span className='d-flex align-items-center gap-2 fs-4'>
									{property?.bathroom} <GiBathtub />
								</span>
							</div>
							<div className='fw-semibold'>
								<small className='text-secondary'>Area</small>{" "}
								<span className='d-flex align-items-center gap-2 fs-4'>
									{property?.size} sqft
								</span>
							</div>
						</div>
					</div>
					<div className=''>
						<h3 className='fw-bold'>Description</h3>
						<p className='text-secondary'>{property?.description}</p>
					</div>
					<div className='d-flex w-100 justify-content-end'>
						{state.isLogin === true? (
							
							<Button
								size='lg'
								variant='primary'
								className='px-5 py-2'
								onClick={handleBooking}
								// onClick={() => setRegisterModal(true)}
							>
								BOOK NOW
							</Button>
						) : (
							<Button className="px-5 py-3 fs-5 fw-bold" onClick={() => setShowLogin(true)}>BOOK NOW</Button>
						)
						}
						
					</div>
					{/* <Link to='/'>back to home</Link> */}
				</div>

				<OrderModal
					show={showModal}
					// property={dataProperty}
					// gotoregister={gotoRegistration}
					onHide={() => setShowModal(false)}
				/>
				<ModalLogin
					show={showLogin}
					onHide={() => setShowLogin(false)}
					gotoregister={() => setModalRegist(true)}
				/>
			</div>
		</Layout>
	);
}
