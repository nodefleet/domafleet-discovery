import React from 'react';
import { useParams } from 'react-router-dom';
import DomainLanding from './DomainLanding';

const DomainDetail: React.FC = () => {
  const { domainName } = useParams<{ domainName: string }>();
  
  // This component is essentially a wrapper around DomainLanding
  // for backward compatibility with the /domain/:domainName route
  return <DomainLanding />;
};

export default DomainDetail;
