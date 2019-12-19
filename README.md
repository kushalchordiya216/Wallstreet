# Wallstreet

## Abstract

- This project is micro-service based web application that simulates a stock market, complete with companies, listings, stock exhcange, news engine and market analytics.>
- Users can interact with the market, by buying, selling and trading shares.
  Much like the real world, user activity drives the market, deciding the direction of the stocks.
- The application is written with a node.js backend to leverage JavaScript's asynchronous by default execution to handle a large number of concurrent users.
- The entire application is divided into 4 distinct packages, which are further divided into distinct services. The services are all run as individual processes while in deployment.
- Every service maintains its own database and is solely responsible for change in its own state.
- However services within the same package have read-only access to each other's database
- A high level over view of the architecture is given below

## 1. Gateway API

    - All user interaction is handled by the gateway. Users can either login or register, after which they are authenticated by the gateway.
    - All subsequent requests are also handled by the gateway which redirects the requests to relevant service

## 2. User Package

    Profile Service
    - This is the service that manages users profile, including personal details, available assets, etc.
    - This service is also responsible for updating user profiles regularly

    Trade Service
    - It basically provides a trading terminal for the user to buy/sell stocks
    - This service will also verify whether a user has enough cash to make a buy bid/enough stocks to make a sell bid
    - It publishes all bids to a comon message queue
    - This service also allows user to cancel bids

## 3. Market Package

    Transaction Service
    - This service executes different kinds of bid logic, such as limits, stop losses, options, etc.
    - It maintains a database of all bids made by the user, comparing all bids and executing the best ones
    - All executed bids, here on referred to as transactions, are published to a message queues

    Pricing Service
    - Thise service runs periodically in the backgroud to decide the price of all company stocks
    - Prices are decided on the basis of executed bids, demand/supply of a particular stock and overall volume of trade
    - All update prices are published to message queues

    Rollback service
    - Bids that are still sale after a given period of time are automatically cancelled
    - Locked cash/Locked shares are also freed

## 4. Analytics Package

    - Offer analytics on user level, company level, and arket level based on user activity of all users

## 5. Inter Service / Pub-Sub Communication

    Communication between services is carried out throgh two means, either REST API endpoints or message queues using kafka, with a publisher subscriber model
    - Queue has 4 topics, bids made, bids cancelled, bids executed, bids rolled back
    - The first two are published by Trade service and subscribed by transactions service and analytics service
    - The other two are published by transaction service and subscribed by pricing, analytics, and profile service
