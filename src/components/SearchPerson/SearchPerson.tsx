import * as React from 'react'
//import { gql } from '@apollo/client'
import { Row, Col } from 'react-bootstrap'

type Props = {
    searchQuery: string;
};

const SearchPerson: React.FunctionComponent<Props> = ({ searchQuery }) => {

    return (
        <Row>
            <Col>{searchQuery}</Col>
        </Row>
    )
}

export default SearchPerson
