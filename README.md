
## **About** this framework
This is a small view/component based web framework that helps you build web applications using modern design patterns. 

You can look at it as *light weight* alternative to frameworks such as *Angular*, *React* and *Vue*.

It is a good starting point for the unexperienced JavaScript programmer that wants to learn programming patterns that applies to these more fullblown frameworks as well, while avoiding the complexity and larger scope of these frameworks.

It promotes an object oriented approach and the use of class based components.

Written by **Thomas Frank**, © Node Hill 2020. MIT-licensed.

## A quick **overview**
* The framework automatically loads all your JavaScript files.
* The framework automatically compiles SASS to CSS.
* **Bootstrap** is included with its full SASS source code, so that you can easily make variable overrides to create your own theme.
* You get an [**icon font included**](https://icofont.com/icons) - a hassle free way of starting to use icons in your application.
* *Hot reload* - The framework automatically reloads your web page when you make code changes.
* *Error handling* - The framework shows most SASS and JavaScript errors "on screen" in your browser.
* The **Base** class that is built in to the framework helps you with basic tasks such as:
    * *rendering* html to the DOM
    * *routing* (changing which content is shown based on the route/url)
    * *event handling* (listening and reacting to when the user clicks, types etc)
* There are 3 important global variables:
    * **store** lets you use *local storage* (persistant storage of user data on the client computer) in an easy way.
    * **sql** lets you query *SQLite* databases from the frontend.
    * **app** gives you access to the *only* instance of the App class (the starting point of your application) anywhere. This makes it easier to communicate between components.

### Install es6-string-html
We recommend that you use *Visual Studio Code* as your editor and that you 

* **install** the *Visual Studio Code extension* [**es6-string-html**](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html).

This will let you highlight html and sql code written in your JavaScript code correctly by using the comments **/&ast;html&ast;/** and **/&ast;sql&ast;/** at appropriate places. 

See how this is done in the examples in this documentation. (But do note that you can't see the actual highlighting in the documentation.)

## Folder structure
The folder structure is as follows:

* **_server** - the source code of the framework. You should not need to change any file in this folder.
* **documentation** - a project built using the framework. It shows the documentation you are reading right now.
* **example-empty** - a project built using the framework. An almost blank/empty App. You can copy this folder and place the copy as a sibling folder to create a new project.
* **example-minimal** - a project built using the framework. An very simple App. You can copy this folder and place the copy as a sibling folder to create a new project.
* **example-shop** - a project built using the framework. A fully working web shop. Study it to understand more about the framework.
* **node_modules** - the installed modules needed by the framework. You should not need to change any file in this folder.
* *.gitignore* - a list of files that should be ignored by git. You should not need to change this file.
* *LICENSE* - an open source MIT license. You should not need to change this file.
* *package-lock.json*. You should not need to change this file.
* *package.json*. You should not need to change this file.
* *README.md* - this documentation.

### Structure inside a project folder
Inside a project folder you have the following structure:
* **databases** SQLite-database(s) that are used in the project.
* **fonts** - the icon font that is included. You should not need to change any file in this folder.
* **images** - here you can place your images. And replace the *favicon.png* if you want to.
* **js** - here you place all your JavaScript. Use one file per class/component. (Start with creating the *App.js* file.)
* **sass** - all the sass. Edit and add files as you want, but avoid changing anything inside the **bootstrap** and **ico-font** sub folders.

## Start a server
You can run several web servers on different ports at once, showing different projects.

The very first time (after downloading) run:

```text
npm install
```

To start a web server write:

```text
npm start name-of-project-folder port-number
```

For example

```text
npm start example-shop 4000
```

or 

```text
npm start documentation 3333
```

(If you omit the port number port 3000 will be used.)

To be able to start several servers at once just run them from different terminal tabs/windows.

## Components
A component is a class that extends the **Base** class.

### Use the **render** method
A component **must** have a method called **render**. This method **must** return a string of HTML. The string **must** have exactly *one* **root element** - an HTML element that encapsulates all the HTML it returns.

We sometimes call the output from the render method a *view*.

The render method *can not* be **async**.

The render method will be called automatically by the framework. But you can also call it yourself when you need to update a view.

##### App.js
```js
class App extends Base {

  render() {
    return /*html*/`
      <h1>Welcome!</h1>
    `;
  }

}
```

### Use the **mount** method
A component **can** have a method called **mount**.

In the **mount** method you do things you would otherwise do in the **constructor** method (that you should avoid using) - like setting property values for the instance of the class/component.

The **mount** method *can* be **async**. This makes it an ideal place for fetching data from the database - since this needs to be done using **await**.

The mount method will be called automatically by the framework the first time a component is shown.

##### App.js
```js
class App extends Base {

  async mount(){
    this.greeting = 'Welcome';
  }

  render() {
    return /*html*/`
      <h1>${this.greeting}</h1>
    `;
  }

}
```
### *Do not* use the **constructor** method
You **should** not write your own constructor.

**Base** will let you inherit a constructor that let you set properties when you create your instances (see the examples below).

### Sub-components
Sub-components are created by other components. This means every component except **App** is a **sub-component**, created using *composition*.

##### Note
You always follow the same basic pattern to create sub-components:
* create an instance of the sub-component in your **mount** method.
* include this instance in the **render** method.

##### App.js
```js
class App extends Base {

  async mount(){
    this.startPage = new StartPage({
      greeting: 'Welcome!';
    });
  }

  render() {
    return /*html*/`
      <div>
        <h1>I am the app</h1>
        ${startPage}
      </div>
    `;
  }

}
```

##### StartPage.js
```js
class StartPage extends Base {

  render() {
    return /*html*/`
      <h2 route="/">
        ${this.greeting}
      </h2>
    `;
  }

}
```

##### Note
In this example we set the property **greeting** of the startpage to "Welcome!" in the **mount** method of **App**.

## Event handling
You can listen to the events **click**, **submit**, **keyup**, **keydown**, **focus** and **blur** on any HTML element by adding an attribute with the same name as the event to the element. 

Set the attribute value to the name of the method you want to call.

##### App.js
```js
class App extends Base {

  sayHi(){
    alert('Hi there!');
  }

  render(){
    return `
      <div>
        <button click="sayHi">
          Click me and I will say Hi!
        </button>
      </div>
    `
  }

}
```

### The event object
The [event object](https://developer.mozilla.org/en-US/docs/Web/API/Event) is an object that the browser generates for each event. In contains a large amount of detailed data about the event.

The event object is always sent to the method that you call from an event. (A convention is to just call it e in our methods.)

The event object contains the useful method **preventDefault** that prevents the default browser behavior.

In the example below we use it to only allow certain characters to be written to an input field.

```js
class App extends Base {

  onlyAllowedKeys(e)
    let allowed = 'abc';
    if(!allowed.includes(e.key)){
      e.preventDefault();
    }
  }

  render(){
    return `
      <div>
        <p>Write a combination of 
          the characters a, b and c:</p>
        <input type="text" keydown="onlyAllowedKeys">
      </div>
    `
  }

}
```

## Routing
The framework never does a hard reload of the web page. Instead it shows (and removes) content based on the users current url - "route" - and the **route**-attribute that you can set on any html element.

### route
To *show* content only when you are on a certain route add the attribute **route** to an element (usually the root element of a component).


```html
<div route="/">
  <h1>Startpage</h1>
</div>
```

```html
<div route="/about-us">
  <h1>About us</h1>
</div>
```

### not-route
If you want to *hide* content on a certain route, add the **not-route** to an element:

```html
<div class="shopping-cart" not-route="/checkout">
...
</div>
```
The example above would hide the shopping-cart when you are on the checkout route.

### route="404"
Adding the attribute **route="404"** will show the content of the element when the framework *can find **no** matching route*.

```html
<div route="404">
  <h1>Sorry, no such page!</h1>
</div>
```

## Document title
The *document title* is the title shown in the tabs in your browser. It is made up of a combination of the **base-title** and the **page-title**.

### base-title
Set the **base-title** attribute on the root element of the **App** component:

```html
<div base-title="My site name: ">
  ...
</div>
```

### page-title
Set the **page-title** attribute on the root element of other components that have routing:

```html
<div route="/about-us" page-title="About us">
  ...
</div>
```

##### Note:
In this case when you visit the route */about-us* the document title will be "**My site name: About us**".

## store
The global variable store will let you store data *persistantly* in the users browser.

This is ideal for data you do not want to store in a database, for example a users shopping cart in a web shop.

### Create a store
Firstly you create a store
```js
store.use('the-name-of-my-store');
```

### Add and change properties
Then you can add properties to the store:

```js

/* Usually we will want to add properties
   only if they don't exist already */

store.computerPlayers = store.computerPlayers 
  || ['Alf', 'Beatrice', 'Cecil'];
store.gameSettings = store.gameSettings 
  || {theme: 'light', difficulty: 3};

// After adding something to the store - call save
store.save();
```

You can change properties:
```js
store.computerPlayers.push('Overlord');
store.gameSettings.difficulty = 4;

// After changing something in the store - call save
store.save();
```

##### Always save your changes
Don't forget to **save**!

The next time the user visits the site, everything you saved in the store will still be there!

## sql
You can use an SQLite database and query it directly from your frontend JavaScript code.

Note that all operations requires you to write **await** before your call to **sql**. This means that you need to make these calls inside an **async** method.

The **mount** method is a ideal to make **async**. You will probably put many of your queries in this method.

### Connect to a database
Before you can query the database you **must** connect to it

```js
await sql(/*sql*/`
  USE name-of-db
`);
```

**Note:** If the database **does not** exist in the folder **databases** it will be created automatically.


### Query the database
Here is an example of a simple query:

```js
let bookTitles = await sql(/*sql*/`
  SELECT title FROM books
`);
```

**Note:** You will always get an **array of objects** back from the database when you run SELECT-queries.

### Always use prepared statements for variables
When we need to use variables in our call to the database the preferable way of doing so is by creating a *prepared statement*. This is done by separating the variable data from the actual query:

```js
let bookTitles = await sql(/*sql*/`
  SELECT title FROM books WHERE title = $title
`, {
  title: 'A Farewell to Arms'
});
```

When you write something with a **$**-sign before it in the query - in this case **$title**, the value will be substituted with a value from the object that we've added as an additional argument.

In this case **$title** will be substituted with "**A Farewell to Arms**".

### INSERT, UPDATE, DELETE etc
Note that you are not limited to **SELECT** queries. You can make any type of query, for example **INSERT** data in the database:

```js
await sql(`
  INSERT INTO books (title, author) 
  VALUES ($title, $author)
`, {
  title: 'A Farewell to Arms',
  author: 'Ernest Hemingway'
});
```

### Cast the result to instances
You can cast the result of a database query to an instance of a class/component. This will convert the objects in your result into instances of that class.

To do so provide the class as an argument before the actual query:

```js
let bookPages = await sql(
  BookPage,
  /*sql*/`
    SELECT * FROM books WHERE title = $title
 `
)
```
This can be very useful for constructing a large number of components that are instances of the same class. They can be written to html in the **render** method by simply including the whole array:

```js
render(){
  return `<div>${bookPages}</div>`
}
```

Take a look at the **App.js**-file of the **example-shop** to see some extensive usage of this technique.

## app
The global variable **app** contains the instance of the **App** class that is in use. This makes it easy for different components to communicate with each other.

### App.js
Les us imagine that the **App** creates the components **shoppingCart** and **checkoutPage** (among others).
```js
class App extends Base {

  mount(){
    ...
    this.shoppingCart = new ShoppingCart();
    this.checkoutPage = new CheckoutPage();
  }

  render(){...}

}
```

### Checkoutpage
Later when you write your **CheckoutPage** you wish that you could call a method in **ShoppingCart** called **getProducts()** to get a list of the products in the cart. But how do you reach this method? 

By using **app**:
```js
class CheckoutPage extends Base {
  
  render(){
    return `
      <div>
        <h2>You want to buy the
          following products:</h2>
        ${app.shoppingCart.getProducts()}
        <h2>Enter your address info:</h2>
        ....
      </div>
    `
  }

}
```