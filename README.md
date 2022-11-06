# Inventory

Currently INSECURE (due to debugging allowances in the config - make sure to change them back to restricted access)

Hi. This Inventory project is a customized template implementation and project development based on the express mongoose templates
floating around, particularly adapted from a grab circa 2022 from RainEggplant's template which was adapted from cdimascio's
template.

The template has been fleshed out for our purposes: quick and dirty inventory system for some BOM mgmt for assembly.

It's pretty gross and incomplete. 

Please see templates:

- [express-mongoose-template](https://github.com/RainEggplant/express-mongoose-template/)
- [generator-express-no-stress-typescript](https://github.com/cdimascio/generator-express-no-stress-typescript/)


## TODO - Running list

- componentType: add abbreviation / ed version for BOM lists - or virtual
- maybe disable the _id and __v fields?
- show ALL fields for component edit view (need to send that from controller too)
- distributor routes controller and services - or if enum handle show this stuff
- solve the forever yarn dev loading / reloading process
- add nvm use to launch script? or similar - script would be better to check and then run etc.


- BOM detail: 
  - Manually create timestamps on data import for componentSelectionEvents because not working in mongoose (parent doesn't have timestamps - maybe it is that kind of bug?)
  


## TODO BAD HUMAN LONG TERMS

- auth!!
- tests!!

## TODO (Cautions) Before Dist or Deploy or whatever

- debugger script in package.json set to allow any public IP address for remote debugging!! (so remove the IP addy in the --inspect clause)

## DEV

- To kill the still-open inspect process on auto relaunch after file save or even just relaunch manually:
  - ```fuser -k 9221/tcp```
  - https://stackoverflow.com/questions/39322089/node-js-port-3000-already-in-use-but-it-actually-isnt
  - https://stackoverflow.com/questions/9168392/shell-script-to-kill-the-process-listening-on-port-3000
  
  


## Quick Start

See the original template Quick Starts in links at the top of this README