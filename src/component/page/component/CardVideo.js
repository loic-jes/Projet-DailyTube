import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Utils from '../../../Utils';

class CardVideo extends Component {
    render() {
        const { item, vues, date, desc = false, showInactive = false } = this.props;

        return (
            <>
                <Link to={"/video/" + item.id_Video} className="text-decoration-none">
                    <Card className="bg-black text-white shadow-card h-100" style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={Utils.prefixUser + item.miniature} className="miniature" />
                        <Card.Body>
                            <Card.Title className="t-2" title={item.titre_Video}>{item.titre_Video}</Card.Title>
                            {item.active_Video === 0 && showInactive && <Card.Title className="t-2" title="alert inactive">Video Inactive</Card.Title>}
                            <Card.Text>
                                {desc && <p className="t-3 m-0" title={item.description_Video}>
                                    {item.description_Video}
                                </p>}
                                <p className="mt-3 mb-0">
                                    <Link to="/chaine" className="color-green text-decoration-none">
                                        {item.pseudo_User}
                                    </Link>
                                </p>
                                <p className="m-0">
                                    {vues} vues - {date}
                                </p>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Link>
            </>
        );
    }
}

export { CardVideo };