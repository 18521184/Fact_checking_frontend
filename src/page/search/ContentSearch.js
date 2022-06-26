import React from 'react';
import './search.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isReadMore:false};
    }

    componentDidMount() {
        AOS.init({
            once: true
        });
        document.title = 'InfoCheck | Search';
    }

    render() {
        const { isReadMore } = this.state;
        return (
            <div className='search__result'>
                <div className='result'>
                    <div><span style={{ fontWeight: "bold" }}>Tiêu đề: </span> {this.props.item.title}</div>
                    <div>
                        <span style={{ fontWeight: "bold" }}>Nội dung:</span> {isReadMore ? this.props.item.content : this.props.item.content.slice(0, 500)} <span className='sentence--modifile' style ={{cursor:'pointer'}} onClick={() => this.setState({ isReadMore: !isReadMore })}>...read more</span>
                    </div>
                    <div>
                        <span style={{ fontWeight: "bold" }}>Ngày xuất bản:</span> {this.props.item.published_date}
                    </div>
                </div>
            </div>
        );
    }
}
