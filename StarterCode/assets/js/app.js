// @TODO: YOUR CODE HERE!




const svgWidth = 950
const svgHeight = 500

let margin = {
	top: 20,
	right: 40,
	left: 60,
	bottom: 100
}

let width = svgWidth - margin.left - margin.right
let height = svgHeight - margin.top - margin.bottom

let svg = d3.select(".chart")
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight)

let chartGroup = svg.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`)

let currentSelection = "smokes"

// this returns a scale that is updated

function xScale(hwData, currentSelection) {
	let xLinearScale = d3.scaleLinear()
		.domain([
			d3.min(hwData.map(d => parseInt(d[currentSelection]))) * 0.8,
			d3.max(hwData.map(d => parseInt(d[currentSelection]))) * 1.2
			])
		.range([0,width])

		return xLinearScale
}

function renderAxes(newXScale, Xaxis) {
	let bottomAxis = d3.axisBottom(newXScale)

	Xaxis
		.transition()
		.duration(1000)
		.call(bottomAxis)

	return xAxis
}


function renderCircles(circlesGroup, newXScale, currentSelection) {
	circlesGroup
		.transition()
		.duration(1000)
		.attr("cx", d => newXScale(d[currentSelection]))

	return circlesGroup
}

;(function() {
	d3.csv("assets/data/data.csv").then(hwData => {
		
		console.log(hwData)

		let xLinearScale = xScale(hwData, currentSelection)
		let yLinearScale = d3.scaleLinear()
			.domain([0, d3.max(hwData.map(d => parseInt(d.age)))])
			.range([height, 0])

		let bottomAxis = d3.axisBottom(xLinearScale)
		let leftAxis = d3.axisLeft(yLinearScale)

		xAxis = chartGroup
			.append("g")
			.classed("x-axis", true)
			.attr("transform", `translate(0, ${height})`)
			.call(bottomAxis)


		chartGroup.append("g").call(leftAxis)

		let circlesGroup = chartGroup
			.selectAll("circle")
			.data(hwData)
			.enter()
			.append("circle")
			.attr("cx", d => xLinearScale(d[currentSelection]))
			.attr("cy", d => yLinearScale(d.age))
			.attr("r", 10)
			.attr("fill", "blue")
			.attr("opacity", ".5")


		let labelsGroup = chartGroup
			.append("g")
			.attr("transform", `translate(${width / 2}, ${height - 20})`)


		labelsGroup
			.append("text")
			.attr("x", 0)
			.attr("y", 20)
			.attr("value", "age")
			.classed("active", true)
			.text(" Age of Smokers in 2014")


		labelsGroup
			.append("text")
			.attr("x", 0)
			.attr("y", 40)
			.attr("value", "smokes")
			.classed("active", true)
			.text(" Smokers  in 2014")

		chartGroup
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0 - margin.left)
			.attr("x", 0 - height/2)
			.attr("dy", "len")
			.classed("axis-text", true)
			.text(" Titl Label 2014")


		labelsGroup.selectAll("text").on("click", function() {
			let value = d3.select(this).attr("value")
			if (value ==currentSelection) {
				currentSelection = value
				xLinearScale = xScale(hwData, currentSlection)
				xAxis = renderAxes(xLinerScale, xAxis)
				circlesGroup = renderCircles(
					circlesGroup,
					xLinearScale,
					currentSelection
					)

				}
			}
			)


		}
		)

})()