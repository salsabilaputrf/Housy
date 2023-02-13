import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "react-query";
import { API } from "lib/api";

import { HiMagnifyingGlass } from "react-icons/hi2";
import { FaRegUser, FaRegCalendar } from "react-icons/fa";
import { TbHistory } from "react-icons/tb";
import { IoLogOut } from "react-icons/io5";
import { MdHomeWork } from "react-icons/md";
import Swal from "sweetalert2";

import { Image } from "react-bootstrap";

import { AppContext } from "context/AppContext";

// Components
import LoginModal from "components/Modals/Login";
import logo from "assets/icons/Logo.svg";
import RegisterModal from "components/Modals/Register";

import { setAuthToken } from "lib/api";

import {
	Navbar,
	Nav,
	Button,
	InputGroup,
	Form,
	Dropdown,
} from "react-bootstrap";
import css from "./Navbar.module.css";


if (localStorage.token) {
	setAuthToken(localStorage.token);
}

export default function Header(props) {
	let navigate = useNavigate();
	const [loginModal, setLoginModal] = useState(false);
	const [registerModal, setRegisterModal] = useState(false);
	const [state, dispatch] = useContext(AppContext);
	// const isLogin = JSON.parse(localStorage.getItem("isLogin"));
	const profilImage = process.env.PUBLIC_URL + "/img/Profile/";
	const [form, setForm] = useState({city: "",});
	const { city } = form;

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

		
	const Toast = Swal.mixin({
		toast: true,
		position: "top-end",
		showConfirmButton: false,
		timer: 2000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer);
			toast.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});

	console.log("state", state)
	const handleSubmit = useMutation(async (e) => {
		try {
			e.preventDefault();

			// Configuration
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};

			// Data body
			// const body = JSON.stringify(form);

			// Insert data for login process
			const response = await API.get("/singleFilter?city=" + city, config);

			// Checking process
			if (response.data != null) {
				// Send data to useContext
				dispatch({
					type: "SEARCH",
					status: state.isLogin,
					isUser: state.user,
					payload: response.data.data,
				});
				console.log("city", state.city)
			}
		} catch (error) {
			Toast.fire({
				icon: "success",
				title: "City not found",
			});
			console.log(error);
		}
	});

	const isLogout = () => {
		dispatch({
			type: "LOGOUT",
		});
		navigate("/");
		Toast.fire({
			icon: "success",
			title: "Logout Success, Bye👋",
		});
	};
	return (
		<>
			<Navbar style={props.style} expand='xxl' className={props.className}>
				{/* <Container className=""> */}
				<div className={css.MaxWidth}>
					<Navbar.Brand className={css.NavbarBrand}>
						<Link to='/'>
							<img src={logo} alt='' height={64} />
						</Link>
					</Navbar.Brand>

					<Navbar.Toggle
						aria-controls='basic-navbar-nav'
						className='ms-auto me-4'
					/>
					<Navbar.Collapse id='basic-navbar-nav' className=''>
						{props.useSearchBar !== false ? (
							<Form className='d-flex'>
								<InputGroup className={css.InputGroup}>
									<Form.Control
									type="text"
										size='lg'
										name='city'
										id='city'
										placeholder='Search'
										aria-label='Search'
										aria-describedby='basic-addon1'
										className='ms-4 border-0 border-end bg-tertiary'
										value={city}
										onChange={handleChange}
									/>
									<Button onClick={(e) => handleSubmit.mutate(e)} variant='outline-primary border-0 border-start bg-tertiary'>
										<HiMagnifyingGlass fontSize={24} strokeWidth={2} />
									</Button>
								</InputGroup>
							</Form>
						) : (
							<div></div>
						)}
						<Nav className='ms-auto px-4 d-flex gap-2'>
							{state.isLogin === true ? (
								<Dropdown className={css.Dropdown}>
									<Dropdown.Toggle className={css.Toggle}>
										<Image
											className={css.ToggleImage}
											src={"http://localhost:5000/uploads/" + state.user.image}
										/>
									</Dropdown.Toggle>

									<Dropdown.Menu align='end' className={css.DropdownMenu}>
										<Dropdown.Item
											as={Link}
											to='/profile'
											className={css.DropMenu}
										>
											<div className='rounded-pill bg-tertiary'>
												<FaRegUser className='m-2 text-primary' />
											</div>
											<span className='fs-5 fw-medium'>Profile</span>
										</Dropdown.Item>
										{state.user.list_as_id === 1 ? (
											<Dropdown.Item
												as={Link}
												to='/addproperty'
												className={css.DropMenu}
											>
												<div className='rounded-pill bg-tertiary'>
													<MdHomeWork className='m-2 text-primary' />
												</div>
												<span className='fs-5 fw-medium'>Add Property</span>
											</Dropdown.Item>
										) : (
											<Dropdown.Item
												as={Link}
												to='/mybooking'
												className={css.DropMenu}
											>
												<div className='rounded-pill bg-tertiary'>
													<FaRegCalendar className='m-2 text-primary' />
												</div>
												<span className='fs-5 fw-medium'>My Booking</span>
											</Dropdown.Item>
										)}
										<Dropdown.Item
											as={Link}
											to='/history'
											className={css.DropMenu}
										>
											<div className='rounded-pill bg-tertiary'>
												<TbHistory className='m-2 text-primary' />
											</div>
											<span className='fs-5 fw-medium'>History</span>
										</Dropdown.Item>
										<Dropdown.Divider />
										<Dropdown.Item onClick={isLogout} className={css.DropMenu}>
											<div className='rounded-pill bg-tertiary'>
												<IoLogOut className='m-2 text-primary' />
											</div>
											<span className='fs-5 fw-medium'>Logout</span>
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							) : (
								<>
									<Button
										size='lg'
										variant='light'
										onClick={() => setLoginModal(true)}
									>
										Sign In
									</Button>
									<Button
										size='lg'
										variant='tertiary'
										onClick={() => setRegisterModal(true)}
									>
										Sign Up
									</Button>
								</>
							)}
						</Nav>
					</Navbar.Collapse>

					{/* </Container> */}
				</div>
			</Navbar>

			<LoginModal
				show={loginModal}
				toRegister={() => setRegisterModal(true)}
				onHide={() => setLoginModal(false)}
			/>
			<RegisterModal
				show={registerModal}
				toLogin={() => setLoginModal(true)}
				onHide={() => setRegisterModal(false)}
			/>
		</>
	);
}
