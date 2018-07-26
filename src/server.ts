import Bootstrap from "../atomicCCMS/server/Bootstrap";

import Users from "../atomicCCMS/_shared/Components/Users/server";
import IssueTracker from "./App/components/IssueTracker/server";

let bootstrap = new Bootstrap();

bootstrap.init((di, router) => {
  return [
    new Users(di, router).init(),
    new IssueTracker(di, router).init()
  ];
})
bootstrap.listen();