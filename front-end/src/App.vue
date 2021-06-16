<template>
<div id="app">
	<header id="header">
		<h1>Hogwarts Battle</h1>
		<nav>
			<router-link to="/">Instructions</router-link> |
			<router-link to="/dashboard">Game</router-link>
		</nav>
	</header>
	<router-view />
	<div class="footer">
		<p><a href="https://github.com/wockomtosh/HogwartsBattle">https://github.com/wockomtosh/HogwartsBattle</a></p>
	</div>
</div>
</template>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2B3D41;
}

#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
}

#nav a.router-link-exact-active {
	color: #42b983;
}

.footer {
	background-color: #2B3D41;
	height: 80px;
	width: 100%;
	padding: 0;
	margin-top: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
	bottom: 0px;
	right: 0px;
}

.footer a {
	display: block;
	font-size: 12px;
	color: #73BFB8;
	text-align: center;
}
</style>
