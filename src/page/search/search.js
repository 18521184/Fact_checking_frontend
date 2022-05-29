import React from 'react';
import './search.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { search } from '@core/utils/api/api';
import { Space40, Space60, Space120 } from '@core/components/atom/space/space';
import { formatString } from '@core/utils/modules/modules';
import { Spinner } from 'react-bootstrap';
export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      number: 4,
      data: [],
      percent: 0,
      tracking: false,
      isSearch: false,
      disable: true,
      error: false,
    };
  }

  componentDidMount () {
    AOS.init({
      once: true
    });
    document.title = 'AICIT-19 | Search';
  }

  render() {
    const { text, number, data, isSearch, disable, error } = this.state;

    const resultSearch = (data) => {
      console.log(data);
      if(data.length === 0) {
        return(
          <div></div>
        );
      }
      else if (data.length > 0) {
        return (
          <div className='search__result'>
            <div className='result'>
              <h5>Rate the search sentence</h5>
              <p>With your sentences: <span className='sentence--modifile'> {data[2].sentence} </span></p>
              <p>We have accuracy: <span>{(Number(data[0][0].percent)*100).toFixed(5)+'%'}</span></p>
              <p>
                - With the above search and accuracy we conclude this sentence: <span className={data[0][1].desition ? 'txt-green' : 'txt-red'}>{ data[0][1].desition.toString() }</span>
              </p>
            </div>
          </div>
        );
      }
      return 0;
    };

    const listItem = (data) => {
      if (data.length === 0) {
        return (
          <div className='no_result'>
            <p className='highlight-color'>No have result, please start your search!</p>
          </div>
        );
      } else if (data.length > 0) {
        const map = data[1].map((item, index) => (
          <div key={index} className='box-card'>
            <div className='box-card__content'>
              <h3 className='highlight-color'>
                Interpretation {index + 1}
              </h3>
              <p> <span className='txt-title-card-result'> Title: {item['title']} </span>
              </p>
              <p style={{ marginTop: '8px' }}>
                <span className='txt-time-search'>Time: {item['publish_time']}</span>
              </p>
              <p>Description: {formatString(item['description'])}</p>
              <div className='content__btn-link'>
                <a className='btn-link--modifile' href={ `${item['link']}` }>Read more</a>
              </div>
            </div>
          </div>
        ));
        return map;
      }
      return 0;
    };

    return (
      <div>
        <div
          data-aos='fade-up'
          data-aos-easing='ease-in-sine'
          data-aos-duration='600'
          className='search__title'>
          <div className='title__layout'>
            <h1 className='highlight-color'>Information Tracking Covid-19 </h1>
            <h3 className='layout__sub-title'> Computational Fact Checking for Statistical
              <span className='highlight-color'> Covid-19 </span>Claims
            </h3>
          </div>
        </div>
        <div
          data-aos='fade-up'
          data-aos-easing='ease-in-sine'
          data-aos-duration='600'
          className='search__description'>
          <p className='description__layout'>
          Verify statistical claims about the coronavirus spread and effects on
          data from the <span className='description--modifile'>official sources</span>.
          </p>
        </div>
        <Space40></Space40>
        <div
          data-aos='fade-right'
          data-aos-easing='ease-in-sine'
          data-aos-duration='600'
          data-aos-delay='600'
          className= 'search'>
          <div className='search__layout'>
            <input
              className='input-search'
              id='input-search'
              placeholder='Sentence about covid-19'
              onChange={async (event) => {
                await this.setState({ text: event.target.value });
                if( text.length > 3 ) {
                  await this.setState({ disable: false });
                } else {
                  this.setState({ disable: true });
                }
              }}
            />
            <button
              className= 'btn-search'
              disabled = { disable }
              onClick={async() => {
                if( text.length === 0 ) {
                  this.setState({error: true});
                  return;
                }
                this.setState({ isSearch: true });
                await search(text, number).then(async res => {
                  if(!res) {
                    this.setState({ error: true });
                    this.setState({ isSearch: false });
                    return;
                  }
                  await this.setState({ data: res});
                  await this.setState({ isSearch: false });
                  await this.setState({ disable: true });
                  await this.setState({ text: '' });
                  document.getElementById('input-search').value = '';
                });
              }}
            >
              <div className='btn-search__layout'>
                <div className='txt-search'>Tracking</div>
                {isSearch?
                  <Spinner animation='border' role='status' size='sm' variant='light' className='spinner-custom'>
                    <span className='visually-hidden'>Loading...</span>
                  </Spinner>
                  :
                  <div></div>
                }
              </div>
            </button>
          </div>
          {error? <div className='search__error'><i className='bx bx-error'></i> Request server error. Please try again!</div> : <div style={{marginTop:'16px'}}></div>}
        </div>
        {resultSearch(data)}
        <Space60></Space60>
        <div
          data-aos='fade-up'
          data-aos-easing='ease-in-sine'
          data-aos-duration='600'
          data-aos-delay='1200'
          className='title-result'>
          <h5 className='txt-result'>
            Results of similar sentences
          </h5>
          <Space40></Space40>
          <div className='layout-card'>{listItem(data)}</div>
        </div>
        <Space120></Space120>
      </div>
    );
  }
}
