class Main extends React.Component {
	constructor(props) {
		super(props)
		this.state = { vov: null }
		this.vovs = this.xpathQuery(`//row[NAZWA_DOD='województwo']/NAZWA`).map(
			name => {
				let id = this.xpathQuery(
					`//row[NAZWA_DOD='województwo' and NAZWA='${name}']/WOJ`
				)
				return { name: name, id: id }
			}
		)
		this.clickHandle = this.clickHandle.bind(this)
		this.style = {
			display: 'flex',
			alignItems: 'flex-start',
			justifyContent: 'flex-start'
		}
	}
	xpathQuery(query) {
		let final = []
		let nodes = this.props.xml.evaluate(
			query,
			this.props.xml,
			null,
			XPathResult.ANY_TYPE,
			null
		)
		let result = nodes.iterateNext()
		while (result) {
			final.push(result.childNodes[0].nodeValue)
			result = nodes.iterateNext()
		}
		if (final.length == 1) {
			return final[0]
		}
		return final
	}
	clickHandle(e) {
		this.setState({ vov: e.target.id })
	}
	render() {
		return (
			<div style={this.style}>
				<div className="vov">
					{this.vovs.map(el => (
						<div
							key={el.id}
							onClick={this.clickHandle}
							className="listEl vovListEl"
							id={el.id}
							style={
								this.state.vov == el.id ? { background: 'cyan' } : null
							}
						>
							{el.name}
						</div>
					))}
				</div>
				<div className="cit">
					{this.state.vov &&
						this.xpathQuery(
							`//row[WOJ='${this.state.vov}' and (NAZWA_DOD='miasto' or NAZWA_DOD='miasto na prawach powiatu')]/NAZWA`
						).map((el, i) => (
							<div key={i} className="listEl">
								{el}
							</div>
						))}
				</div>
			</div>
		)
	}
	componentDidMount() {}
}

fetch('http://localhost:5500/data.xml')
	.then(res => res.text())
	.then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
	.then(data => {
		ReactDOM.render(<Main xml={data} />, document.getElementById('root'))
	})
