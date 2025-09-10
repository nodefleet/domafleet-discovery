import { gql } from 'graphql-request';

// Get domains with pagination and filters - Updated to match Doma schema
export const GET_DOMAINS = gql`
  query GetDomains($take: Int!, $skip: Int!, $name: String, $claimStatus: NamesQueryClaimStatus, $sortOrder: SortOrderType) {
    names(take: $take, skip: $skip, name: $name, claimStatus: $claimStatus, sortOrder: $sortOrder) {
      items {
        name
        expiresAt
        tokenizedAt
        eoi
        transferLock
        claimedBy
        registrar {
          name
          ianaId
        }
        tokens {
          tokenId
          networkId
          ownerAddress
          type
          startsAt
          expiresAt
          createdAt
          explorerUrl
          tokenAddress
          chain {
            name
            networkId
          }
          listings {
            id
            externalId
            price
            offererAddress
            orderbook
            currency {
              name
              symbol
              decimals
            }
            expiresAt
            createdAt
          }
        }
      }
      totalCount
      pageSize
      currentPage
      totalPages
      hasPreviousPage
      hasNextPage
    }
  }
`;

// Get a specific domain by name
export const GET_DOMAIN = gql`
  query GetDomain($name: String!) {
    name(name: $name) {
      name
      expiresAt
      tokenizedAt
      eoi
      transferLock
      claimedBy
      registrar {
        name
        ianaId
        websiteUrl
        supportEmail
      }
      nameservers {
        ldhName
      }
      dsKeys {
        keyTag
        algorithm
        digest
        digestType
      }
      tokens {
        tokenId
        networkId
        ownerAddress
        type
        startsAt
        expiresAt
        createdAt
        explorerUrl
        tokenAddress
        chain {
          name
          networkId
        }
        listings {
          id
          externalId
          price
          offererAddress
          orderbook
          currency {
            name
            symbol
            decimals
          }
          expiresAt
          createdAt
        }
        activities {
          type
          createdAt
          ... on TokenMintedActivity {
            tokenId
            txHash
            networkId
            finalized
          }
          ... on TokenTransferredActivity {
            tokenId
            txHash
            networkId
            finalized
            transferredTo
            transferredFrom
          }
          ... on TokenListedActivity {
            tokenId
            txHash
            networkId
            finalized
            orderId
            startsAt
            expiresAt
            seller
            buyer
            payment {
              price
              tokenAddress
              currencySymbol
            }
            orderbook
          }
        }
      }
      activities {
        type
        createdAt
        ... on NameClaimedActivity {
          sld
          tld
          claimedBy
          txHash
        }
        ... on NameTokenizedActivity {
          sld
          tld
          networkId
          txHash
        }
        ... on NameRenewedActivity {
          sld
          tld
          expiresAt
          txHash
        }
      }
    }
  }
`;

// Get marketplace listings
export const GET_LISTINGS = gql`
  query GetListings($take: Float!, $skip: Float!, $tlds: [String!], $createdSince: DateTime, $sld: String) {
    listings(take: $take, skip: $skip, tlds: $tlds, createdSince: $createdSince, sld: $sld) {
      items {
        id
        externalId
        price
        offererAddress
        orderbook
        currency {
          name
          symbol
          decimals
        }
        expiresAt
        createdAt
        updatedAt
        name
        nameExpiresAt
        registrar {
          name
          ianaId
        }
        tokenId
        tokenAddress
        chain {
          name
          networkId
        }
      }
      totalCount
      pageSize
      currentPage
      totalPages
      hasPreviousPage
      hasNextPage
    }
  }
`;

// Get offers for domains
export const GET_OFFERS = gql`
  query GetOffers($take: Float!, $skip: Float!, $tokenId: String, $status: OfferStatus, $sortOrder: SortOrderType) {
    offers(take: $take, skip: $skip, tokenId: $tokenId, status: $status, sortOrder: $sortOrder) {
      items {
        id
        externalId
        price
        offererAddress
        orderbook
        currency {
          name
          symbol
          decimals
        }
        expiresAt
        createdAt
        name
        nameExpiresAt
        registrar {
          name
          ianaId
        }
        tokenId
        tokenAddress
        chain {
          name
          networkId
        }
      }
      totalCount
      pageSize
      currentPage
      totalPages
      hasPreviousPage
      hasNextPage
    }
  }
`;

// Get token activities
export const GET_TOKEN_ACTIVITIES = gql`
  query GetTokenActivities($tokenId: String!, $take: Float!, $skip: Float!, $sortOrder: SortOrderType) {
    tokenActivities(tokenId: $tokenId, take: $take, skip: $skip, sortOrder: $sortOrder) {
      items {
        type
        createdAt
        ... on TokenMintedActivity {
          tokenId
          txHash
          networkId
          finalized
        }
        ... on TokenTransferredActivity {
          tokenId
          txHash
          networkId
          finalized
          transferredTo
          transferredFrom
        }
        ... on TokenListedActivity {
          tokenId
          txHash
          networkId
          finalized
          orderId
          startsAt
          expiresAt
          seller
          buyer
          payment {
            price
            tokenAddress
            currencySymbol
          }
          orderbook
        }
        ... on TokenOfferReceivedActivity {
          tokenId
          txHash
          networkId
          finalized
          orderId
          expiresAt
          buyer
          seller
          payment {
            price
            tokenAddress
            currencySymbol
          }
          orderbook
        }
        ... on TokenPurchasedActivity {
          tokenId
          txHash
          networkId
          finalized
          orderId
          purchasedAt
          seller
          buyer
          payment {
            price
            tokenAddress
            currencySymbol
          }
          orderbook
        }
      }
      totalCount
      pageSize
      currentPage
      totalPages
      hasPreviousPage
      hasNextPage
    }
  }
`;

// Get name activities for a specific domain name
export const GET_NAME_ACTIVITIES = gql`
  query GetNameActivities($name: String!, $take: Float!, $skip: Float!, $sortOrder: SortOrderType) {
    nameActivities(name: $name, take: $take, skip: $skip, sortOrder: $sortOrder) {
      items {
        type
        createdAt
        ... on NameClaimedActivity {
          sld
          tld
          claimedBy
          txHash
        }
        ... on NameTokenizedActivity {
          sld
          tld
          networkId
          txHash
        }
        ... on NameRenewedActivity {
          sld
          tld
          expiresAt
          txHash
        }
        ... on NameDetokenizedActivity {
          sld
          tld
          networkId
          txHash
        }
      }
      totalCount
      pageSize
      currentPage
      totalPages
      hasPreviousPage
      hasNextPage
    }
  }
`;

// Get name statistics
export const GET_NAME_STATISTICS = gql`
  query GetNameStatistics($tokenId: String!) {
    nameStatistics(tokenId: $tokenId) {
      name
      activeOffers
      offersLast3Days
      highestOffer {
        id
        externalId
        price
        offererAddress
        orderbook
        currency {
          name
          symbol
          decimals
        }
        expiresAt
        createdAt
      }
    }
  }
`;
