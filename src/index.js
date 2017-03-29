import React, { Component} from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';



const root = document.getElementById('root');

class App extends Component{
  constructor(props){
    super();
    this.specialNumber = props.specialNumber; 
    this.state = { products: [], foo: 'bar' };
    this.onDeleteProduct = this.onDeleteProduct.bind(this);
    this.onFooChange = this.onFooChange.bind(this);
  }
  onFooChange(foo){
    this.setState({ foo: foo });
  }
  onDeleteProduct(product){
    const products = this.state.products.filter( _product => _product.id !== product.id);
    this.setState({ products });
  }
  componentDidMount(){
    axios.get('/api/products')
    .then(response => response.data)
    .then( products => this.setState( { products }));
  }
  render(){
    const active = (pathname)=> this.props.router.location.pathname === pathname;
    const obj = Object.assign({}, this.state, { onDeleteProduct: this.onDeleteProduct, onFooChange: this.onFooChange });
    return (
      <div className='container'>
        <ul className='nav nav-tabs' style={{ marginBottom: '10px' }}>
          <li className={ active('/') ? 'active': '' }>
            <Link to='/'>Home</Link>
          </li>
          <li className={ active('/products') ? 'active': '' }>
            <Link to='/products'>Products</Link>
          </li>
          <li className={ active('/foo') ? 'active': '' }>
            <Link to='/foo'>Foo</Link>
          </li>
        </ul>
        { this.props.children && React.cloneElement(this.props.children, obj) }
      </div> 
    );
  }
}

const Home = ()=>(
  <div className='well'>
    Home
  </div>
);

const ProductDetail = (props)=> {
  const filtered = props.products.filter( product => product.id == props.router.params.id); 
  if(!filtered.length)
    return null;
  const product = filtered[0];
  return (
    <div className='well'>
      <Link to='/products'>Back</Link>
      <br />
      { product.name }
      <br />
      { product.id }
    </div>
  )
};

const Products = ({ products, onDeleteProduct })=>(
  <div className='well'>
    Products
    <ul>
    { products.map( product => (
      <li key={product.id}>
      <button className='btn btn-warning' onClick={()=> onDeleteProduct(product)}>Delete</button>
      <Link to={`/products/${product.id}`}>{ product.name }</Link>
      </li>
      ) ) }
    </ul>
  </div>
);

const Foo = ({ foo, onFooChange })=> (
  <div className='well'>
    Foo { foo }
    <select value={ foo } className='form-control' onChange={(ev)=> onFooChange(ev.target.value)}>
      <option value='buzz'>Buzz</option>
      <option value='fizz'>Fizz</option>
      <option value='bar'>Bar</option>
    </select>
  </div>
);

const routes = (
  <Router history={ hashHistory}>
    <Route path='/' component={ App }>
      <IndexRoute component={ Home } />
      <Route path='foo' component={ Foo } />
      <Route path='products' component={ Products } />
      <Route path='products/:id' component={ ProductDetail } />
    </Route>
  </Router>
);


render(routes, root);
